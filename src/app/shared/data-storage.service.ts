import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Since we are injecting the HTTPClient service into this service, we add the @Injectable() decorator
@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private httpClient: HttpClient) { }

}
