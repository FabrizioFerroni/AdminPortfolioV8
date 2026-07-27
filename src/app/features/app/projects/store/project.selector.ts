import { projectFeature } from './project.reducer';

// TODO: Estos selectors son para el get de projects
export const selectProjects = projectFeature.selectProjects;
export const selectProject = projectFeature.selectProject;
export const loadingProject = projectFeature.selectIsLoading;
export const errorProject = projectFeature.selectError;
export const paginationMeta = projectFeature.selectMeta;
export const statusCodeProject = projectFeature.selectStatusCode;
export const projectState = projectFeature.selectProjectsState;
export const selectProjectsStats = projectFeature.selectStats;
export const selectProjectsStatsLoading = projectFeature.selectIsLoadingStats;

//TODO: Estos selectors son para el update a project
export const loadingFormProject = projectFeature.selectIsLoadingForm;
export const errorFormProject = projectFeature.selectFormError;
export const statusCodeFormProject = projectFeature.selectFormStatusCode;

//TODO: Estos selectors son para obtener las imagenes
export const imagesSelectedProject = projectFeature.selectImagesProject;
export const imageLoadingProject = projectFeature.selectImageLoadingProject;
export const imageErrorProject = projectFeature.selectImageErrorProject;
export const imageStatusCodeProject = projectFeature.selectImageStatusCodeProject;

//TODO: Estos selectors son para obtener todos los proyectos para el select.
export const selectProjectSelect = projectFeature.selectProjectsSelect;
export const selectIsLoadingSelect = projectFeature.selectIsLoadingSelect;
export const selectErrorSelect = projectFeature.selectErrorSelect;
export const selectStatusCodeSelect = projectFeature.selectStatusCodeSelect;
