const STORAGE_KEY = "chain_listing_id";

export const getNextListingId = (): string => {
  const current = localStorage.getItem(STORAGE_KEY);
  let nextId = 1;

  if (current) {
    nextId = parseInt(current, 10) + 1;
  }

  localStorage.setItem(STORAGE_KEY, nextId.toString());

  return nextId.toString();
};

export const resetListingId = () => {
  localStorage.setItem(STORAGE_KEY, "0");
};
