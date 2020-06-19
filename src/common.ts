import { resolve } from 'dns'
import { rejects } from 'assert'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const compressing = require('compressing')
const rimraf = require('rimraf')

/**
 * 检查资源包
 * @param resource 资源包路径
 */
export function checkResourceAvailable(resource: string): boolean {
  if (!path.isAbsolute(resource)) {
    // 请传入绝对路径
    throw Error(`${resource} path is not a absolute path,please check now.`)
  }
  // 检查文件是否存在。
  if (!fs.existsSync(path.resolve(resource))) {
    throw Error(`${resource} path is not exist,please check now.`)
  }
  if (!checkFileType(resource)) {
    throw Error(`${resource} is not zip,please check your file now.`)
  }
  return true
}

export function checkGeneratorDirPath(fileDirPath: string) {
  // 校验当前文件不存在
  if (!path.isAbsolute(fileDirPath)) {
    // 请传入绝对路径
    throw Error(`${fileDirPath} path is not a absolute path,please check now.`)
  }
  // 获取文件包路径 /
  mkdirp.sync(fileDirPath)
  return true
}

/**
 * 压缩文件
 * @param filePath
 */
export function zipFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    compressing.zip
      .compressDir(filePath, `${filePath}.zip`)
      .then(() => {
        resolve(`${filePath}.zip`)
      })
      .catch((e: any) => {
        reject(e)
      })
  })
}

/**
 * 删除文件
 * @param filePath
 */
export function delPatchFile(filePath: string) {
  return new Promise((resolve, reject) => {
    rimraf(filePath, function (e: any) {
      // 删除当前目录下的 test.txt
      reject(e)
    })
    resolve(filePath)
  })
}

export function unzipResource(zipFilePath: string) {
  return new Promise((resolve, reject) => {
    compressing.zip
      .uncompress(zipFilePath, getFileDir(zipFilePath))
      .then(() => {
        const unzipFileName = zipFilePath.split('.zip')[0]
        resolve(unzipFileName)
      })
      .catch((e: any) => {
        reject(e)
      })
  })
}

/**
 * 文件上传验证.
 * @param filePath
 */
function checkFileType(filePath: string): boolean {
  const reg = new RegExp(/^.*?\.(zip)$/)
  if (filePath === '') {
    return false
  } else {
    return reg.test(filePath)
  }
}

/**
 * 获取文件包路径
 * @param filePath
 */
function getFileDir(filePath: string): string {
  const index = filePath.lastIndexOf('/')
  const dirPath = filePath.substring(0, index + 1)
  return dirPath
}
