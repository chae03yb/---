export interface School {
    SCHUL_CODE:         string,
    ATPT_OFCDC_SC_CODE: string,
    SCHUL_NM:           string
}

export class NotFoundError extends Error {};
export class ServerError   extends Error {};
export class InvalidKey    extends Error {};
export class InvalidType   extends Error {};