import { createContext, useContext, useEffect, useState } from "react";
import type { CityType } from "../components/CityList";
import { BASE_URL } from "../utils/baseUrl";
type CitiesContextType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: CurrentCityType;
  getCity: (id: string) => void;
};
const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  isLoading: false,
  currentCity: {
    id: "",
    cityName: "",
    emoji: "",
    date: 0,
    notes: "",
  },
  getCity: function (id: string): void {
    throw new Error(`Function not implemented.${id}`);
  },
});

type CurrentCityType = {
  id:string,
  cityName: string;
  emoji: string;
  date: number;
  notes: string;
};

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<CurrentCityType>({
    id:"",
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

  async function getCity(id: string) {
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

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
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
