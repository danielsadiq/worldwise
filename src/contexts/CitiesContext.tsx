import { createContext, useContext, useEffect, useState } from "react";

import { BASE_URL } from "../utils/baseUrl";
import type { CityType } from "../types/cityType";
type CitiesContextType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: CurrentCityType;
  getCity: (id: number) => void;
  createCity: (newCity: CityType) => void;
  deleteCity: (id: number) => void;
};

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

type CurrentCityType = {
  id: number;
  cityName: string;
  emoji: string;
  date: number;
  notes: string;
};

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<CurrentCityType>({
    id: 0,
    cityName: "",
    emoji: "",
    date: 0,
    notes: "",
  });

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const req = await fetch(`${BASE_URL}/cities`);
        const data = await req.json();
        setCities(data);
      } catch {
        alert("There was an error loading data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id: number) {
    try {
      setIsLoading(true);
      const req = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await req.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error loading data");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity: CityType) {
    setIsLoading(true);
    fetch("http://localhost:9000/cities", {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setCities((cities) => [...cities, newCity]);
        setIsLoading(false);
        // Update the local array or display a success message
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        // Display an error message
      });
  }
  async function deleteCity(id: number) {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCities((cities) => cities.filter((x) => x.id !== id));
    } catch  {
      alert("There was an error deleting the city.")
    } finally{
      setIsLoading(false);
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
