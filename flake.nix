{
  description = "homelab-wol-desktop";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, utils, rust-overlay }:
    utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };

        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" "clippy" ];
        };
        isDarwin = pkgs.stdenv.isDarwin;

        linuxInputs = with pkgs; [
          # broken 
          webkitgtk_4_1
          libdrm
          pcre2
        ];

        darwinInputs = with pkgs; [
          darwin.apple_sdk.frameworks.WebKit
          darwin.apple_sdk.frameworks.AppKit
          darwin.apple_sdk.frameworks.CoreServices
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            pkg-config
            nodejs
            nodePackages.pnpm
            rustToolchain
          ] ++ (if isDarwin then [] else [ pkgs.wrapGAppsHook4 ]);

          buildInputs = with pkgs; [
            librsvg
          ] ++ (if isDarwin then darwinInputs else linuxInputs);

          shellHook = if isDarwin then "" else ''
            export XDG_DATA_DIRS="$GSETTINGS_SCHEMAS_PATH"
          '';
        };
      });
}