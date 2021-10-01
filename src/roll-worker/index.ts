import { expose } from 'comlink';
import { Roller } from '../roller';

const roller = new Roller();
export type SimulationWorker = typeof roller;

expose(roller);
