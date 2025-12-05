// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MacLisp",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "MacLisp",
            targets: ["MacLisp"]
        ),
        .executable(
            name: "repl",
            targets: ["repl"]
        )
    ],
    targets: [
        .target(
            name: "MacLisp",
            resources: [
                .copy("Resources/wisp_jsc.js")
            ]
        ),
        .executableTarget(
            name: "repl",
            dependencies: ["MacLisp", "CEditline"]
        ),
        .systemLibrary(
            name: "CEditline"
        )
    ]
)

