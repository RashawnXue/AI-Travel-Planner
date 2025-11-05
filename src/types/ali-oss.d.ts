declare module 'ali-oss' {
  export interface OSSOptions {
    region: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
    secure?: boolean
  }

  export interface PutObjectResult {
    name: string
    url: string
    res: {
      status: number
      headers: Record<string, string>
    }
  }

  export default class OSS {
    constructor(options: OSSOptions)
    put(name: string, file: Blob | File, options?: { headers?: Record<string, string> }): Promise<PutObjectResult>
    delete(name: string): Promise<{ res: { status: number } }>
  }
}
