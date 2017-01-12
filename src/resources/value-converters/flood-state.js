import { floodStates } from '../../map';

// Import environment variables
import env from '../../environment';

export class FloodStateValueConverter {
  toView(value) {
    return value ? env.floodStates[value] : '-';
  }
}
