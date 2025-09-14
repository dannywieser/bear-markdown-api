export interface BearFile {
  ZFILENAME: string
  ZUNIQUEIDENTIFIER: string
}

export interface BearNote {
  Z_PK: number
  ZCREATIONDATE: string
  ZMODIFICATIONDATE: string
  ZTEXT: string
  ZTITLE: string
  ZTRASHED: number
  ZUNIQUEIDENTIFIER: string
}

export interface BearTag {
  Z_PK: number
  ZTAGCON: string
  ZTITLE: string
}

export interface BearTagRel {
  Z_5NOTES: number
  Z_13TAGS: number
}
