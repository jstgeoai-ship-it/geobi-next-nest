export type KelurahanOptions = string[];
export type RwOptions = string[];
export type RtOptions = string[];

export interface RwOptionsQuery {
  kelurahan?: string;
}

export interface RtOptionsQuery {
  kelurahan?: string;
  rw?: string;
}
