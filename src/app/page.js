"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// some base styles
const mapContainerStyle = { width: "100%", height: "100%" };
const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function Home() {
  // search (text in navbar) filters our mock data
  const [query, setQuery] = useState("");

  // map & places state
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 35.6528, lng: -97.4781 }); // Edmond-ish
  const [selectedId, setSelectedId] = useState(null); // which marker/list is open
  const [userPos, setUserPos] = useState(null); // geolocation marker

  // load with Places library
  const { isLoaded } = useJsApiLoader({
    id: "gigx-gmaps",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
  });

  // ---- MOCK DATA WITH COORDS (so markers can show popups) ----
  const users = useMemo(
    () => [
      {
        id: "u-alpha",
        name: "Ava — Guitar Tutor",
        address: "123 Main St, Edmond, OK",
        tags: ["guitar", "music", "lessons"],
        position: { lat: 35.6578, lng: -97.4781 },
      },
      {
        id: "u-beta",
        name: "Ben — Python Mentor",
        address: "42 Tech Park, OKC, OK",
        tags: ["python", "coding", "mentorship"],
        position: { lat: 35.4676, lng: -97.5164 },
      },
      {
        id: "u-gamma",
        name: "Gia — Yoga Instructor",
        address: "9 Startup Ave, Norman, OK",
        tags: ["yoga", "fitness", "wellness"],
        position: { lat: 35.2226, lng: -97.4395 },
      },
      {
        id: "u-delta",
        name: "Dan — 3D Printing",
        address: "501 Makers Row, Tulsa, OK",
        tags: ["3d-printing", "makerspace", "prototype"],
        position: { lat: 36.1539, lng: -95.9925 },
      },
      {
        id: "u-epsilon",
        name: "Ella — Guitar Basics",
        address: "777 Innovate Blvd, Edmond, OK",
        tags: ["guitar", "beginner", "music"],
        position: { lat: 35.6523, lng: -97.4788 },
      },
      {
        id: "u-zeta",
        name: "Zed — Woodworking",
        address: "100 Founders Ct, OKC, OK",
        tags: ["woodwork", "tools", "craft"],
        position: { lat: 35.472, lng: -97.5206 },
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q) ||
        u.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [users, query]);

  // ---- GEOLOCATION (center map on user and add a marker) ----
  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setCenter((c) => c ?? coords);
        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(12);
        }
      },
      // silent fail; we’ll keep default center
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // ---- MAP REF ----
  const onLoadMap = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onUnmountMap = useCallback(() => {
    mapRef.current = null;
  }, []);

  // helper: focus a place from the list
  const focusPlace = (place) => {
    setSelectedId(place.id);
    if (mapRef.current) {
      mapRef.current.panTo(place.position);
      mapRef.current.setZoom(13);
    }
  };

  return (
    <div className="min-h-dvh bg-white text-black">
      {/* Navbar */}
      <nav className="border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <a href="/" className="text-xl font-bold tracking-tight">
            GIGX
          </a>

          {/* Search bar (filters our internal list) */}
          <div className="flex-1">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills (e.g., guitar), tags, addresses…"
              className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="inline-flex items-center rounded-xl px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="inline-flex items-center rounded-xl px-4 py-2 text-white bg-black hover:opacity-90 transition"
            >
              Sign up
            </a>
          </div>
        </div>
      </nav>

      {/* Page Title */}
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">GIGX</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Registered users only. Use the search box to filter by skill (e.g., "guitar") or address.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map Panel */}
          <section className="rounded-2xl border overflow-hidden">
            <div className="p-3 border-b font-medium">
              Map
            </div>

            <div className="relative h-[60vh]">
              {!GOOGLE_MAPS_API_KEY ? (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </div>
              ) : !isLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  Loading map…
                </div>
              ) : (
                <GoogleMap
                  onLoad={onLoadMap}
                  onUnmount={onUnmountMap}
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={11}
                  options={mapOptions}
                >
                  {/* User geolocation marker */}
                  {userPos && (
                    <Marker
                      position={userPos}
                      icon={{
                        // a simple blue dot
                        path: window.google?.maps?.SymbolPath?.CIRCLE,
                        scale: 6,
                        fillColor: "#3b82f6",
                        fillOpacity: 1,
                        strokeColor: "#1e3a8a",
                        strokeWeight: 2,
                      }}
                      title="You are here"
                    />
                  )}

                  {/* Mock/filtered items */}
                  {filtered.map((it) => (
                    <Marker
                      key={it.id}
                      position={it.position}
                      onClick={() => setSelectedId(it.id)}
                    />
                  ))}

                  {/* One InfoWindow for whichever is selected */}
                  {selectedId && (
                    <InfoForSelected
                      selectedId={selectedId}
                      close={() => setSelectedId(null)}
                      places={users}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
          </section>

          {/* List Panel */}
          <section className="rounded-2xl border overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-medium">Results</div>
              <div className="text-xs text-neutral-500">{filtered.length} found</div>
            </div>

            <ul className="divide-y max-h-[60vh] overflow-y-auto">
              {filtered.map((it) => (
                <li
                  key={it.id}
                  className="p-4 hover:bg-neutral-50 transition cursor-pointer"
                  onClick={() => focusPlace(it)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      <div className="text-sm text-neutral-600">{it.address}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(it.tags || []).map((t) => (
                          <span
                            key={t}
                            className="text-xs rounded-full border px-2 py-1 text-neutral-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs rounded-lg border px-2 py-1">
                      View
                    </span>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="p-6 text-center text-neutral-500">
                  No matches. Try another search.
                </li>
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

/** Renders a single InfoWindow for whichever user id is selected */
function InfoForSelected({ selectedId, close, places }) {
  const p = places.find((x) => x.id === selectedId);
  if (!p) return null;
  return (
    <InfoWindow
      position={p.position}
      onCloseClick={close}
      options={{ pixelOffset: new google.maps.Size(0, -8) }}
    >
      <div className="text-sm">
        <div className="font-semibold">{p.name}</div>
        <div className="text-neutral-600">{p.address}</div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {(p.tags || []).map((t) => (
            <span
              key={t}
              className="text-[10px] rounded-full border px-2 py-0.5 text-neutral-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </InfoWindow>
  );
}