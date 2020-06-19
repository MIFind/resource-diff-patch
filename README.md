# 前端资源包增量更新与补丁合并

---

## resource-diff-patch

1. 生成增量包

```javascript
const { generatorPatchZip } = require('@mt/resource-diff-patch')

generatorPatchZip(
  '/xxx/test_1.0.0.zip',
  '/xxx/test_1.0.1.zip',
  '/xxx/patchs',
  'test_1.0.0_1.0.1.patch'
)
  .then((patchResourceZipPath) => {
    console.log(patchResourceZipPath)
  })
  .catch((e) => {
    console.log(e)
  })
```

2. 打补丁到旧资源包

```javascript
const { patchResource } = require('@mt/resource-diff-patch')

patchResource(
  '/Users/mifind/Desktop/test/test.js.zip',
  '/Users/mifind/Desktop/test/test.patch.zip',
  '/Users/mifind/Desktop/test',
  'test.new'
).then((res) => {
  console.log(res)
})

```
