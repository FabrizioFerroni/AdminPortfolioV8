import { PaginacionQuery } from '@/shared/interfaces';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TestimonialCount, TestimonialData, TestimonialList } from '../interface';

export const TestimonialsActions = createActionGroup({
  source: 'Testimonials',
  events: {
    // Triggers
    'Get All Testimonials': props<{ paginado: PaginacionQuery }>(),
    'Get Testimonial By Id': props<{ id: string }>(),
    'Get Testimonials Stats': emptyProps(),
    'Create Testimonial': props<{ data: FormData }>(),
    'Update Testimonial': props<{ id: string; data: FormData }>(),
    'Delete Testimonial': props<{ id: string }>(),

    // Success
    'Get All Testimonials Success': props<{ data: TestimonialData }>(),
    'Get Testimonial By Id Success': props<{ testimonial: TestimonialList | null }>(),
    'Get Testimonials Stats Success': props<{ stats: TestimonialCount }>(),
    'Create Testimonial Success': emptyProps(),
    'Update Testimonial Success': emptyProps(),
    'Delete Testimonial Success': props<{ id: string }>(),

    // Failure
    'Get All Testimonials Failure': props<{ error: string; statusCode: number }>(),
    'Get Testimonial By Id Failure': props<{ error: string; statusCode: number }>(),
    'Get Testimonials Stats Failure': props<{ error: string; statusCode: number }>(),
    'Create Testimonial Failure': props<{ error: string; statusCode: number }>(),
    'Update Testimonial Failure': props<{ error: string; statusCode: number }>(),
    'Delete Testimonial Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
