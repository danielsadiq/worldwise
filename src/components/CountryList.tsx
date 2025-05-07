import { useCities } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

export type CityType = {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: number;
};
// type CountryListType = {
//   cities: CityType[];
//   isLoading: boolean;
// };
function CountryList() {
  const countries: CityType[] = [];
  const {cities, isLoading} = useCities();
  cities.map((x) =>countries.map(el => el.country).includes(x.country) ? null : countries.push(x));

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first coty by clicking on a city on the map" />
    );
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
