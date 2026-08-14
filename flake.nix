{
  description = "KERNEL_ROOT_SINGULARITY_V1";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/b134951a4c9f3c995fd7be05f3243f8ecd65d798";
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    packages.${system}.default = pkgs.runCommand "lysander-kernel-vector1" {} ''
      mkdir -p $out
      printf "KERNEL_VECTOR1_LOCKED\nRevision: ${self.rev or "dirty"}\n" > $out/fingerprint
    '';
  };
}
