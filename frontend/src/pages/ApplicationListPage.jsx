import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import SearchBar from '../components/Listings/SearchBar';
import DropdownMenu from '../components/Layout/DropdownMenu';
import { useSearchParams, Link, createSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import titleize from 'titleize';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

const FilterSection = ({ children, ...props }) => {
  const BUTTON_CLASS = clsx(
    `flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500`,
    props.buttonClassName
  );
  const EXPAND_ICON = (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
  const COLLAPSE_ICON = (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className={props.mobile ? "border-t border-gray-200 px-4 py-6" : clsx(
      "border-b border-gray-200 pb-6",
      props.first ? "" : "pt-6",
      props.last ? "" : "lg:border-b-0"
    )}>
      <h3 className="-my-3 flow-root">
        {/* Expand/collapse section button */}
        <button type="button" className={BUTTON_CLASS} onClick={() => props.onCollapse(!props.collapsed)}>
          <span className="font-medium text-gray-900">{props.title}</span>
          <span className="ml-6 flex items-center">
            {props.collapsed ? EXPAND_ICON : COLLAPSE_ICON}
          </span>
        </button>
      </h3>
      {/* Filter section, show/hide based on section state. */}
      <div className={clsx("pt-6", { hidden: props.collapsed })}>
        <div className="space-y-4">
          {props.values.map(([value, label]) => {
            const inputId = `filter-${props.field}-${value}-${uuidv4()}`;
            const checked = props.selected && props.selected.includes(value);
            return (
              // Generate a uuid for the input id
              <div className="flex items-center" key={inputId}>
                <input
                  id={inputId}
                  value={value}
                  name={props.field}
                  type={props.radio ? "radio" : "checkbox"}
                  className={clsx(
                    "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
                    props.inputClassName
                  )}
                  checked={checked}
                  onChange={(e) => props.onChange(e.target.value, e.target.checked)}
                />
                <label
                  htmlFor={inputId}
                  className={clsx("ml-3 text-sm text-gray-600", props.labelClassName)}
                >
                  {props.labelFactory ? props.labelFactory(label) : label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
};

const ApplicationCard = ({ application }) => {
  return (
    <Link to={`/applications/${application.id}/`} className="group border-2 border-gray-200 rounded-lg">
      <div className="flex flex-col space-y-1 p-2">
        <h1 className="font-bold text-gray-600 text-lg sm:text-2xl">
          {"Application " + application.pet}
        </h1>
        <div className="flex flex-wrap gap-y-2 gap-x-2 items-start justify-start">
          <div className="text-white text-xs drop-shadow-sm rounded-lg bg-gray-300 px-2 py-1 font-bold">
            Status: {application.status}
          </div>
        </div>
      </div>
    </Link>
  )
};

async function searchApplications(ordering, filters, page=1, token) {
  const params = new URLSearchParams({
    sort_by: ordering,
    page: page
  });
  const filterParams = Object.entries(filters).map(([field, values]) => `${field}=${values.join(",")}`).join("&");
  const allParams = `${params.toString()}&${filterParams}`;
  console.log("Fetching application with token " + token);
  const url = `${process.env.REACT_APP_SERVER}/api/applications?${allParams}`;

  return await fetch(url,
    {headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }}
  ).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(data => {
    return data;
  }).catch(e => {
    console.log(e);
    return null;
  });
};

const ApplicationListPage = () => {
    const [searchParams, _] = useSearchParams();

    const [breeds, setBreeds] = useState([]);
    const [searchResults, setSearchResults] = useState(null);

    const [currSearch, setCurrSearch] = useState({ query: "", ordering: "name", filters: {}, page: 1 });
    const [numResults, setNumResults] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState({
      "status": false,
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { token } = useContext(UserContext);

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
      let search = { ...currSearch };
      if (firstUpdate.current) {
        firstUpdate.current = false;

        // Fetch the list of breeds from the backend
        fetch(`${process.env.REACT_APP_SERVER}/api/pets/breeds`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setBreeds(data);
          })
          .catch(e => {
            console.log(e);
          });

        // If there are search params in the URL, use them
        setCurrSearch({
          ...currSearch,
          query: searchParams.get("q") || "",
          ordering: searchParams.get("ordering") || "name"
        });

        return;
      }

      console.log(
        `Searching with ordering "${search.ordering}" and page ${search.page}`
      );
      searchApplications(search.ordering, search.filters, search.page, token).then(data => {
        if (!data) { return; }
        setSearchResults(data.results);
        setNumResults(data.num_results);
        setNumPages(data.num_pages);
      });

      // Update the URL with the search term, but don't reload the page
      const params = new URLSearchParams({
        q: currSearch.query,
        ordering: currSearch.ordering,
        page: currSearch.page
      });
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    }, [currSearch]);

    const ORDERINGS = [
      ["-created_at", "Last Created"],
      ["-updated_at", "Last Updated"],
    ]

    const onFilterChange = (field, value, checked) => {
      const filter = new Set(currSearch.filters[field] || []);
      if (checked) {
        filter.add(value);
      } else {
        filter.delete(value);
      }

      setCurrSearch({ ...currSearch, filters: { ...currSearch.filters, [field]: Array.from(filter) } });
    };

    const FilterSections = ({ mobile }) => {
      return (
        <form className={mobile ? "mt-4" : "hidden lg:block"}>
          <FilterSection
            field="status"
            title="Status"
            values={[
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["denied", "Denied"],
            ]}
            collapsed={isCollapsed["status"]}
            onCollapse={(value) => setIsCollapsed({ ...isCollapsed, "status": value })}
            selected={currSearch.filters["status"] || []}
            onChange={(value, checked) => onFilterChange("status", value, checked)}
            mobile={mobile}
            first
          />
        </form>
      );
    }

    const getPageSize = () => searchResults ? searchResults.length : 0;

    return (
      <div>
        {/* Off-canvas filters for mobile, show/hide based on off-canvas filters state */}
        <div className={clsx("relative z-40 lg:hidden", showMobileFilters ? "pointer-events-auto" : "pointer-events-none")}>
          <div className={clsx("fixed inset-0 bg-black bg-opacity-25 transition-opacity ease-linear duration-300", showMobileFilters ? "opacity-100" : "opacity-0")}></div>
          <div className="fixed inset-0 z-40 flex">
            {/* Off-canvas menu, show/hide based on off-canvas menu state. */}
            <div className={clsx(
              `relative transform ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto
               bg-white py-4 pb-12 shadow-xl transition ease-in-out duration-300`,
              showMobileFilters ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <FilterSections mobile />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Search results</h1>
          <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-gray-200 pb-6 space-y-4 space-x-4 sm:space-y-0">
            <div className="flex flex-grow items-center justify-start">
              <div className="relative w-full sm:max-w-md">
                  <SearchBar
                    value={currSearch.query}
                    onChange={(e) => setCurrSearch({ ...currSearch, query: e.target.value })}
                  />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu buttonText="Sort">
                {ORDERINGS.map(([value, label]) => (
                  <div
                    key={value}
                    className={clsx(
                      "block px-4 py-2 text-sm hover:cursor-pointer hover:bg-gray-100",
                      currSearch.ordering === value ? "font-medium text-gray-900" : "text-gray-500"
                    )}
                    onClick={() => setCurrSearch({ ...currSearch, ordering: value })}
                  >
                    {label}
                  </div>
                ))}
              </DropdownMenu>

              <button
                type="button"
                className="group inline-flex justify-center gap-x-2 items-center rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 transition ease-in-out duration-300 lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between bg-white py-3">
              <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{getPageSize() * (currSearch.page - 1) + 1}</span> to <span className="font-medium">{getPageSize() * currSearch.page}</span> of <span className="font-medium">{numResults}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {/* Show previous button */}
                    <button
                      className="
                        relative inline-flex items-center px-2 py-2 rounded-l-md
                        border border-gray-300 bg-white text-sm font-medium
                        text-gray-700 hover:bg-gray-50 hover:cursor-pointer
                        disabled:opacity-50"
                      onClick={() => setCurrSearch({ ...currSearch, page: currSearch.page - 1 })}
                      disabled={currSearch.page === 1}
                    >
                      Previous
                    </button>
                    {/* Show next button */}
                    <button
                      className="
                        relative inline-flex items-center px-2 py-2 rounded-r-md
                        border border-gray-300 bg-white text-sm font-medium
                        text-gray-700 hover:bg-gray-50 hover:cursor-pointer
                        disabled:opacity-50"
                      onClick={() => setCurrSearch({ ...currSearch, page: currSearch.page + 1 })}
                      disabled={currSearch.page === numPages}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-9 pb-24 border-t border-gray-200">
            <h2 className="sr-only">Filters</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <FilterSections />

              {/* Pet Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {/* If we're not waiting for search, display the results */}
                  {searchResults && searchResults.map(application => (
                    <ApplicationCard application={application} key={application.id} />
                  ))}

                  {/* If we're not waiting for search and there are no results, display a message */}
                  {searchResults && searchResults.length === 0 && (
                    <div className="col-span-3">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-12 w-12 text-gray-400" >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search terms or filters.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
};

export default ApplicationListPage;
