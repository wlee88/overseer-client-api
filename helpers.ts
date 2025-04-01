export async function requestMedia(searchTerm: string): Promise<any> {
  const { results: searchResults } = await fetchFromOverseer({
    apiPath: `/search?page=1&language=en&query=${searchTerm}`,
    method: "GET",
  });

  console.log({ searchResults });
  const filteredResults = searchResults.filter((result: any) =>
    ["tv", "movie"].includes(result.mediaType) && result.posterPath !== null
  );

  if (filteredResults.length === 0) {
    return;
  }
  const result = filteredResults[0];

  const { mediaType, id: mediaId } = result;

  const { id: userId } = await fetchFromOverseer({
    apiPath: "/auth/me",
    method: "GET",
  });

  if (mediaType === "tv") {
    const tvResult = await fetchFromOverseer({
      apiPath: `/tv/${mediaId}`,
      method: "GET",
    });
    console.log({ tvResult });

    const { externalIds: { tvdbId } } = tvResult;

    const seasons = tvResult.seasons.filter((season: any) =>
      season.airDate !== null
    ).map((season: any) => {
      return season.seasonNumber;
    });

    const [firstSonarr] = await fetchFromOverseer({
      apiPath: "/settings/sonarr",
      method: "GET",
    });

    const {
      id: serverId,
      activeProfileId: profileId,
      activeDirectory: rootFolder,
      activeLanguageProfileId: languageProfileId,
      is4k,
    } = firstSonarr;

    console.log({ tvdbId });

    const body = JSON.stringify({
      mediaType,
      mediaId,
      tvdbId,
      seasons,
      is4k,
      serverId,
      profileId,
      rootFolder,
      languageProfileId,
      userId,
    });
    console.log({ body });

    await fetchFromOverseer({ apiPath: "/request", method: "POST", body });
  } else {
    const [firstRadarr] = await fetchFromOverseer({
      apiPath: "/settings/radarr",
      method: "GET",
    });

    const {
      id: serverId,
      activeProfileId: profileId,
      activeDirectory: rootFolder,
      activeLanguageProfileId: languageProfileId,
      is4k,
    } = firstRadarr;

    const body = JSON.stringify({
      mediaType,
      mediaId,
      is4k,
      serverId,
      profileId,
      rootFolder,
      languageProfileId,
      userId,
    });

    console.log({ body });

    const response = await fetchFromOverseer({
      apiPath: "/request",
      method: "POST",
      body,
    });

    return response;
  }
}

export function overseerrApiUrl() {
  const apiUrl = Deno.env.get("OVERSEERR_API_URL") ?? "";
  const withApiParameters = `${apiUrl}/api/v1`;
  return withApiParameters;
}

export async function fetchFromOverseer(
  options: { apiPath: string; method: "GET" | "POST"; body?: string },
) {
  const { apiPath, method, body } = options;
  const baseUrl = overseerrApiUrl();

  console.log({
    overseerrApiUrl: overseerrApiUrl(),
    key: Deno.env.get("OVERSEERR_API_KEY"),
  });

  const url = `${baseUrl}${apiPath}`;
  console.log({ url });
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Api-Key": `${Deno.env.get("OVERSEERR_API_KEY")}`,
  };
  const result = await fetch(url, {
    method,
    headers,
    body,
  });
  const response = await result.json();
  console.log({ response });
  return response;
}
