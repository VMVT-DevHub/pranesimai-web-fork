import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Response, Survey } from '../types';
import { isEmpty } from './functions';

interface GetAll {
  resource: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

interface GetOne {
  resource: Resources;
  id?: string | any;
  populate?: string[];
  scope?: string;
}
interface UpdateOne<T = any> {
  resource?: Resources;
  id?: string;
  params?: T;
}

interface Create {
  resource: Resources | string;
  params?: any;
  config?: any;
  id?: string;
}

export interface AddressSearchItem {
  id: number;
  pavad: string;
  vietove: string;
  tipas: string;
}

export enum Resources {
  SURVEYS = 'surveys',
  START_SURVEY = 'sessions/start',
  RESPONSES = 'responses',
  CURRENT_SESSION = 'sessions/current',
  FILES_UPLOAD = 'files/upload',
}

export enum Populations {
  PAGE = 'page',
  QUESTIONS = 'questions',
}

class Api {
  private AuthApiAxios: AxiosInstance;
  private readonly proxy: string = '/api';

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        config.url = this.proxy + config.url;

        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();

    return res.data;
  };

  getAll = async ({ resource, ...rest }: GetAll) => {
    const config = {
      params: rest,
    };

    return this.errorWrapper(() => this.AuthApiAxios.get(`/${resource}/all`, config));
  };

  get = async ({ resource, id, ...rest }: GetAll) => {
    const config = {
      params: { page: 1, pageSize: 10, ...rest },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getOne = async ({ resource, id, ...rest }: GetOne) => {
    const config = {
      params: rest,
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/${resource}/${id ? `/${id}` : ''}`, params),
    );
  };

  post = async ({ resource, id, params, config = {} }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/${resource}${id ? `/${id}` : ''}`, params, config),
    );
  };

  getCurrentResponse = async (id: string): Promise<Response> => {
    return this.getOne({
      resource: Resources.RESPONSES,
      populate: [Populations.PAGE, Populations.QUESTIONS],
      id,
    });
  };

  submitResponse = async (
    id: string,
    params: { values: { [key: number]: any } },
  ): Promise<{ nextResponse: number }> => {
    return this.post({
      resource: `${Resources.RESPONSES}/${id}/respond`,
      params,
    });
  };

  getAllSurveys = async (): Promise<Survey[]> => {
    return this.get({
      resource: Resources.SURVEYS,
    });
  };

  getCurrentSession = async (): Promise<any> => {
    return this.get({
      resource: Resources.CURRENT_SESSION,
    });
  };

  uploadFiles = async (files: File[] = []): Promise<any> => {
    if (isEmpty(files)) return [];

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
      const data = await Promise.all(
        files?.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const { data } = await this.AuthApiAxios.post(
            `/${Resources.FILES_UPLOAD}`,
            formData,
            config,
          );
          return data;
        }),
      );

      return data?.map((file) => {
        return {
          id: file.id,
          name: file.filename,
          size: file.size,
        };
      });
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  };

  startSurvey = async (params: {
    survey: number;
    auth: boolean;
  }): Promise<{
    id: number;
    survey: number;
    lastResponse: number;
    token: string;
    finishedAt: string;
    createdAt: string;
  }> => {
    return this.post({
      resource: Resources.START_SURVEY,
      params,
    });
  };

  // ---------------------------------------------------------------------------
  // ADDRESS SEARCH ENDPOINTS (via /addresses service)
  // ---------------------------------------------------------------------------

  findGyv = async (query: string): Promise<AddressSearchItem[]> => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.get('/addresses/find/gyv', {
        params: { q: query, top: 10 },
      }),
    );
  };

  findAdr = async (gyvId: number, query: string, gatId?: number): Promise<AddressSearchItem[]> => {
    const params: any = {
      gyv: gyvId,
      q: query,
      top: 10,
    };

    if (gatId != null) {
      params.gat = gatId;
    }

    return this.errorWrapper(() => this.AuthApiAxios.get('/addresses/find/adr', { params }));
  };

  searchGat = async (gyvId: number, query: string): Promise<AddressSearchItem[]> => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.get('/addresses/search/gat', {
        params: { gyv: gyvId, q: query, top: 10 },
      }),
    );
  };
}

const api = new Api();

export { api };
