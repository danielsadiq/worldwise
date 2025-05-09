import type { CityType } from "./cityType";
import type { CurrentCityType } from "./currentCityType";

export type CitiesContextType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: CurrentCityType;
  getCity: (id: number) => void;
  createCity: (newCity: CityType) => void;
  deleteCity: (id: number) => void;
};