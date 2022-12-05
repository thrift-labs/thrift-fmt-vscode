# thrift-formatter README

A Thrift file formatter extention

use https://github.com/thrift-labs/thrift-fmt-ts

(a typescript implement of https://github.com/thrift-labs/thrift-fmt )

unfortunately, it was created with a typo name "thirft-formater"

## Features

1. keeping the comments
2. align the tail comment of struct/enum
3. align the field's assgin part in struct/enum/union/exception
4. patch the miss field (list_sep or required)

## Requirements

## Extension Settings

1. `thriftFormatter.patch` boolean, default `true`

if `true` will patch the miss `required` / `,` for field or function.

2. `thriftFormatter.indent` number, default `4`

the space indent for field in struct or enum and function in service.

3. `thriftFormatter.assignAlign` boolean, default `true`

align the field's assgin part in struct/enum/union/exception

## Known Issues

see [#issues](https://github.com/thrift-labs/thrift-fmt-vscode/issues)

## Release Notes

see [CHANGELOG.md](https://github.com/thrift-labs/thrift-fmt-vscode/blob/main/CHANGELOG.md) and [vscode Page](https://marketplace.visualstudio.com/items?itemName=alingse.thirft-formatter)
