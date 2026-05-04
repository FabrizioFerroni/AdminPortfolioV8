import { HttpParams } from '@angular/common/http';

type QueryParamValue = string | number | boolean | null | undefined;

export function construirQueryParams(obj: object | null | undefined): HttpParams {
  if (!obj) return new HttpParams();

  return Object.entries(obj).reduce((params, [llave, valor]) => {
    if (valor === null || valor === undefined) return params;

    if (Array.isArray(valor)) {
      return valor.reduce(
        (acc: HttpParams, item) => (item != null ? acc.append(llave, String(item)) : acc),
        params
      );
    }

    return params.append(llave, String(valor as QueryParamValue));
  }, new HttpParams());
}
