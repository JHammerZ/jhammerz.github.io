{
  description = "KERNEL_ROOT_SINGULARITY_V1";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/b134951a4c9f3c995fd7be05f3243f8ecd65d798";

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      name = "lysander-kernel-vector1";
      src = ./.;
      installPhase = ''
        mkdir -p $out
        echo "KERNEL_VECTOR1_LOCKED" > $out/fingerprint
        echo "Revision: ${self.rev or "dirty"}" >> $out/fingerprint
        echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $out/fingerprint
      '';
    };
  };
}
