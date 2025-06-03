import Alea from "alea";

import {Star, computeHabitableZone} from "./stars";
import {
    Planet,
} from "./planets";
import { closeBinaryProbability, addPlanets } from "./addPlanets";

export class StarSystem {
    alea: any; // Alea random number generator instance
    seed: number;
    stars: Array<Star>;
    planets: Array<Planet>;
    habitableZoneMin?: number;
    habitableZoneMax?: number;

    constructor(seed: number) {
        this.seed = seed;

        const alea = new (Alea as any)(seed);
        this.alea = alea;

        this.stars = [new Star(alea)];

        // Second star so far is only cosmetic and doesn't affect important
        // things like orbits or habitable zones.
        if (this.alea() < closeBinaryProbability) {
            this.stars.push(new Star(alea));
            this.stars = this.stars.sort((a, b) => {
                return b.mass - a.mass;
            });
        }

        this.planets = [];
    }

    computeHabitableZone() {
        [this.habitableZoneMin, this.habitableZoneMax] = computeHabitableZone(
            this.stars[0].starType, this.stars[0].luminosity);
    }

    addPlanets() {
        addPlanets(this, () => this.alea());
    }

    get metallicity(): number {
        let metallicity: number = this.stars[0].metallicity;
        for (let s of this.stars) {
            metallicity = Math.max(metallicity, s.metallicity);
        }
        return metallicity;
    }
}
