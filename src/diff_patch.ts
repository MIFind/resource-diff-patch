const bsdiff = require('bsdiff-nodejs')
const path = require('path')
const {
  zipFile,
  delPatchFile,
  checkResourceAvailable,
  checkGeneratorDirPath,
  unzipResource,
} = require('./common')

/**
 * 生成patch文件
 * @param old_resource 【旧资源包】- zip
 * @param new_resource 【新资源包】- zip
 * @param patch_file_dir path_file 生成目录【绝对路径】
 * @param patch_file_name patch_file_name 生成名称
 */
export function generatorPatchZip(
  old_resource: string,
  new_resource: string,
  patch_file_dir: string,
  patch_file_name: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // check resources exist
      if (
        checkResourceAvailable(old_resource) &&
        checkResourceAvailable(new_resource) &&
        checkGeneratorDirPath(patch_file_dir)
      ) {
        const patchFilePath = path.join(patch_file_dir, patch_file_name)
        bsdiff.diffSync(old_resource, new_resource, patchFilePath)
        const zipFilePath = await zipFile(patchFilePath)
        delPatchFile(patchFilePath)
        resolve(zipFilePath)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 生成patch文件
 * @param old_resource 【旧资源包】- zip
 * @param patch_resource 【增量包】- zip
 * @param generator_dir 新资源包生成目录【绝对路径】
 * @param generator_zip_name 新资源包zip名称
 *
 */
export function patchResource(
  old_resource: string,
  patch_resource: string,
  generator_dir: string,
  generator_zip_name: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // check resources exist
      if (
        checkResourceAvailable(old_resource) &&
        checkResourceAvailable(patch_resource) &&
        checkGeneratorDirPath(generator_dir)
      ) {
        const patchFilePath = await unzipResource(patch_resource)
        const generatorFilePath = path.join(
          generator_dir,
          `${generator_zip_name}.zip`
        )
        bsdiff.patchSync(old_resource, generatorFilePath, patchFilePath)
        resolve(generatorFilePath)
      }
    } catch (e) {
      reject(e)
    }
  })
}
