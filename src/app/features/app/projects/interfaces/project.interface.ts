import { FormControl } from '@angular/forms';

export interface ProjectList {
  id: string;
  title: string;
  summary: string;
  description: string;
  publishedDate: Date | null;
  slug: string;
  visibility: string;
  type: string;
  imageUrl: string;
  imageFullUrl: string;
  images: ProjectImageList[];
  technologies: ProjectTechnologieList[];
  features: ProjectFeatureList[];
}

export interface ProjectImageList {
  id: string;
  imageUrl: string;
  imageFullUrl: string;
  displayOrder: number;
  altText: string;
}

export interface ProjectTechnologieList {
  id: string;
  name: string;
  category: string;
}

export interface ProjectFeatureList {
  id: string;
  description: string;
  displayOrder: number;
}

export interface ProjectCount {
  total: number;
  totalFront: number;
  totalBack: number;
  totalImgs: number;
}

export interface CreateNewProjectDto {
  title: string;
  summary: string;
  description: string;
  publishedDate: string;
  visibility: string;
  type: string;
  urlGithub?: string;
  urlProyect?: string;
  projectFeatures: InsertOrUpdateProjectFeatDto[];
  projectTechnologies: InsertOrUpdateProjectTecDto[];
}

export interface InsertOrUpdateProjectTecDto {
  id?: string;
  name: string;
  category: string;
  projectId?: string;
}

export interface InsertOrUpdateProjectFeatDto {
  id?: string;
  description: string;
  displayOrder: number;
  projectId?: string;
}

export interface UpdateProjectDto {
  title: string;
  summary: string;
  description: string;
  publishedDate: string;
  visibility?: string;
  type?: string;
  projectFeatures: InsertOrUpdateProjectFeatDto[];
  projectTechnologies: InsertOrUpdateProjectTecDto[];
  deleteDataFT: DeleteProjectTechFeat[];
}

export interface DeleteProjectTechFeat {
  id: string;
  module: number;
}

export interface ProjectFormControls {
  title: FormControl<string>;
  summary: FormControl<string | null>;
  description: FormControl<string | null>;
  publishedDate: FormControl<Date | null>;
  urlGithub: FormControl<string>;
  urlProyect: FormControl<string>;
  visibility: FormControl<string>;
  type: FormControl<string>;
  features: FormControl<InsertOrUpdateProjectFeatDto[]>;
  technologies: FormControl<InsertOrUpdateProjectTecDto[]>;
}
