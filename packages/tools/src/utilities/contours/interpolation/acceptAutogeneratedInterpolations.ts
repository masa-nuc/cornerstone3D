import InterpolationManager from '../../segmentation/InterpolationManager/InterpolationManager';
import type { AcceptInterpolationSelector } from '../../../types/InterpolationTypes';
import type AnnotationGroupSelector from '../../../types/AnnotationGroupSelector';

/**
 * Accepts interpolated annotations, marking them as autoGenerated false.
 *
 * @param annotationGroupSelector - viewport or FOR to select annotations for
 * @param selector - nested selection criteria
 */
export default function acceptAutogeneratedInterpolations(
  annotationGroupSelector: AnnotationGroupSelector,
  selector: AcceptInterpolationSelector
) {
  InterpolationManager.acceptAutoGenerated(annotationGroupSelector, selector);
}