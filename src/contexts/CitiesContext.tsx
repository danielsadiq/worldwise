import { createContext, useContext, useEffect, useReducer } from "react";

import { BASE_URL } from "../utils/baseUrl";
import type { CityType } from "../types/cityType";
import type { CurrentCityType } from "../types/currentCityType";
import type { CitiesContextType } from "../types/cititesContext";

const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  isLoading: false,
  currentCity: {
    id: 0,
    cityName: "",
    emoji: "",
    date: 0,
    notes: "",
  },
  getCity: function (id: number): void {
    throw new Error(`Function not implemented.${id}`);
  },
  createCity: function (newCity: CityType): void {
    throw new Error(`Function not implemented.${newCity.cityName}`);
  },
  deleteCity: function (id: number): void {
    throw new Error(`Function not implemented.${id}`);
  },
});

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

type StateType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: CurrentCityType[];
  error: string;
};
type Action =
  | { type: 'loading' }
  | { type: 'cities/loaded'; payload: CityType[] }
  | { type: 'city/created'; payload: CityType }
  | { type: 'rejected'; payload: string }
  | { type: 'city/loaded'; payload: CurrentCityType }
  | { type: 'city/deleted'; payload: number };

function reducer(state: StateType, action:Action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      // setIsLoading(true);
      dispatch({ type: "loading" });
      try {
        const req = await fetch(`${BASE_URL}/cities`);
        const data = await req.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "there was an error loading the data",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id: number) {
    if (Number(id) === currentCity.id) return
    dispatch({ type: "loading" });

    try {
      const req = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await req.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city",
      });
    }
  }

  async function createCity(newCity: CityType) {
    dispatch({ type: "loading" });
    try {
      await fetch("http://localhost:9000/cities", {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Update the local array or display a success message
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      // Display an error message
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      });
    }
  }

  async function deleteCity(id: number) {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      alert("There was an error deleting the city.");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const values = useContext(CitiesContext);
  if (values === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  return values;
}

export { useCities, CitiesProvider };
