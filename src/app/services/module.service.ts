import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Module {
  id: number;
  name: string;
  description: string;
  loadDays: number;
}
@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private apiService: ApiService) { }

  getAllModules(){
    return this.apiService.get('/modules');
  }

  getModuleById(id: number) {
    return this.apiService.get(`/modules/${id}`);
  }
  createModule(module: any) {
    return this.apiService.post('/modules', module);
  }

  updateModule(id: number, module: any) {
    return this.apiService.put(`/modules/${id}`, module);
  }
}
