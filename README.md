# thirft-formatter README

A Thrift file formatter extention

use https://github.com/thrift-labs/thrift-fmt-ts

(a typescript implement of https://github.com/thrift-labs/thrift-fmt )

## Features

1. keeping the comments
2. align the tail comment of struct / enum
3. patch the miss field ( list_sep or required)

## Requirements

## Extension Settings

1. `thirftFormatter.patch` boolean, default `true`

if `true` will patch the miss `required` / `,` for field or function.

2. `thirftFormatter.indent` number, default `4`

the space indent for field in struct or enum and function in service.

## Known Issues

see [#issues](https://github.com/thrift-labs/thrift-fmt-vscode/issues)

## Release Notes

see [CHANGELOG.md](https://github.com/thrift-labs/thrift-fmt-vscode/blob/main/CHANGELOG.md) and [vscode Page](https://marketplace.visualstudio.com/items?itemName=alingse.thirft-formatter)
