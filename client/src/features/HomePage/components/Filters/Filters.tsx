import Categories from './components/Categories';
import SliderWithInputs from './components/SliderWithInputs';
import SortBy from './components/SortBy';

export default function Filters() {
  return (
    <div className="mr-5 flex w-60 flex-col gap-6 overflow-y-auto overflow-x-hidden bg-white p-4 pb-0">
      <h2 className="text-2xl font-bold">Filters</h2>
      <hr />
      <SortBy />
      <hr />
      <section>
        <h3 className="text-2xl font-bold">Price</h3>
        <SliderWithInputs />
      </section>
      <hr />
      <section>
        <h3 className="text-2xl font-bold">Category</h3>
        <Categories />
      </section>
    </div>
  );
}
