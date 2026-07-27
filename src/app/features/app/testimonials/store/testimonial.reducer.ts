import { createFeature, createReducer, on } from '@ngrx/store';
import { TestimonialState } from '../interface';
import { TestimonialsActions } from './testimonial.actions';

const initialState: TestimonialState = {
  testimonials: [],
  testimonial: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  stats: null,
  isLoadingStats: false,
  formError: null,
  formStatusCode: null,
  isLoadingForm: false,
};

export const testimonialFeature = createFeature({
  name: 'testimonials',
  reducer: createReducer(
    initialState,

    on(TestimonialsActions.getAllTestimonials, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(TestimonialsActions.getAllTestimonialsSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      testimonials: data.testimonials,
      meta: data.meta,
    })),

    on(TestimonialsActions.getAllTestimonialsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(TestimonialsActions.getTestimonialById, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(TestimonialsActions.getTestimonialByIdSuccess, (state, { testimonial }) => ({
      ...state,
      isLoading: false,
      testimonial,
    })),

    on(TestimonialsActions.getTestimonialByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(TestimonialsActions.getTestimonialsStats, state => ({
      ...state,
      isLoadingStats: true,
      error: null,
      statusCode: null,
    })),

    on(TestimonialsActions.getTestimonialsStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoadingStats: false,
      stats,
    })),

    on(TestimonialsActions.getTestimonialsStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingStats: false,
      error,
      statusCode,
    })),

    on(TestimonialsActions.createTestimonial, state => ({
      ...state,
      isLoadingForm: true,
      formError: null,
      formStatusCode: null,
    })),

    on(TestimonialsActions.createTestimonialSuccess, state => ({
      ...state,
      testimonials: state.testimonials,
      stats: state.stats,
      isLoadingForm: false,
    })),

    on(TestimonialsActions.createTestimonialFailure, (state, { error, statusCode }) => ({
      ...state,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(TestimonialsActions.updateTestimonial, state => ({
      ...state,
      isLoadingForm: true,
      formError: null,
      formStatusCode: null,
    })),

    on(TestimonialsActions.updateTestimonialSuccess, state => ({
      ...state,
      testimonials: state.testimonials,
      stats: state.stats,
      isLoadingForm: false,
    })),

    on(TestimonialsActions.updateTestimonialFailure, (state, { error, statusCode }) => ({
      ...state,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(TestimonialsActions.deleteTestimonial, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(TestimonialsActions.deleteTestimonialSuccess, (state, { id }) => ({
      ...state,
      isLoading: false,
      testimonials: state.testimonials.filter(t => t.id !== id),
    })),

    on(TestimonialsActions.deleteTestimonialFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    }))
  ),
});
