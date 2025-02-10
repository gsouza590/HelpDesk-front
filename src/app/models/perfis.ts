export const PerfilMapping: { [key: number]: string } = {
  0: "ADMIN",
  1: "CLIENTE",
  2: "TECNICO",
};
// Mapeamento reverso: string -> número
export const PerfilReversoMapping: { [key: string]: number } = {
  ADMIN: 0,
  CLIENTE: 1,
  TECNICO: 2,
};
