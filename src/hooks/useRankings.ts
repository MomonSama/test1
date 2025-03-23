import { useState, useEffect } from 'react';
import { fetchTopRankings } from '../services/faceitApi';
import type { RankingItem } from '../types/rankings';

interface UseRankingsOptions {
  region?: string;
  limit?: number;
}

interface UseRankingsResult {
  rankings: RankingItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const FPL_PLAYERS = [
    "765d2b9b-ea6e-4b67-bfb5-3d76d74ab95b",
    "702c9dd5-c84d-42de-942e-58e921fd34d9",
    "ae024156-2546-4b7a-a4e8-f518c35d3c72",
    "06b83f3b-3b65-4de1-b556-ea02535050e8",
    "bb9b1a15-7018-42fa-864b-48cc70e0d91b",
    "c365e0fe-ae29-41d7-b331-ed8904e32d2b",
    "648af157-90c5-4e69-b0c3-31ae037f4bae",
    "bee6d48a-7048-49cf-8ee2-b10c2ea104ca",
    "c6154c13-83dd-4d8d-997c-e8bbb8ae5199",
    "de7b67fa-82fc-424f-a66e-ede3ebcd21ed",
    "19a920b6-5e98-47b7-aeda-00f273e40525",
    "7b6887ff-e03d-4c40-8b2e-c95d1e56b2ac",
    "49411d69-e811-4163-8d29-21ab3a0cea7c",
    "395ecd8a-479e-4f65-8333-1e1bd7c00fab",
    "780ff937-76e4-4608-9406-c2fdae354a69",
    "9e90daa5-432f-413f-bd49-30dbc36c13b8",
    "9f689672-0886-4d26-a9d7-416cb5ab6115",
    "544b4f6d-02cf-4f71-a38a-3e40ee91f3c9",
    "91396c85-8498-429e-bf1a-5f8da3c2336b",
    "9645c4ed-b24b-4bac-b793-f2f777379325",
    "45cd23f1-9213-4d93-87b9-26b4bf8720c4",
    "35086d74-6e47-4367-8d56-422f03f037e0",
    "b5c3e65c-bb6c-49d1-ad75-3823b52ce576",
    "75368140-a160-4330-a81f-f5ffcb5c0c6e",
    "c16694e9-eada-4c07-a0cb-281f08b2cab7",
    "0a38e0a3-03a1-4aea-8c24-396ad8d802c1",
    "c58c4e47-645a-4a40-a208-01bfdbcdeadd",
    "eff87bef-d56c-4922-a000-549479b5720d",
    "3119c6de-c32b-4989-88d6-c9a7d81599d0",
    "4945aac8-7dab-4045-994e-6410462a486f",
    "58310774-1dc5-42a5-8de4-fff2559622c6",
    "43fd5da0-e231-4b11-b914-3425b1015345",
    "a5fa9e4c-0beb-4b4b-94bf-fbda21fe9fe4",
    "08b354e6-c7f5-4e64-9feb-cba6baea4ebc",
    "9ba7401e-19a6-4131-a462-04b9fe493225",
    "e58b6957-f54c-409f-ad80-dc4649399dd1",
    "38dc1f9b-1b5c-47e8-b76e-a51688a882e0",
    "c0d03737-ae6b-4589-8efb-fb272d84deb4",
    "e50676d1-ea6c-4876-893f-53aac4b6dc6f",
    "48211fe6-6deb-4b55-b662-fcec37db3bca",
    "2c3e74fc-683a-461b-9449-df6f7ad9f5e0",
    "d309100a-7b97-4a80-9093-7b7e13d063f8",
    "49285fa7-74d5-4490-89aa-766c38a45fb5",
    "7d90eabe-88be-4371-9a53-5a31064f9eee",
    "e361e514-9a7b-402f-85e3-12a14ea8c82b",
    "606edd4a-c24b-47e6-a937-158c32b9ca6c",
    "53f6c5ae-9276-4e2e-85bf-3549406ab358",
    "d01968b9-6b62-4fd8-abd4-69e3ac09926b",
    "e91edead-4164-49a8-a7e2-5fdfb1cb2544",
    "72ff0a02-a099-46e4-8789-2b5b09ea488a",
    "6417459b-053f-40d0-b2f5-8a26e7f05750",
    "3205b4b6-6b51-4bb9-ab82-c0c2777e081a",
    "1dc91562-8f8c-40bc-8725-62417c0e8eb1",
    "a66cccad-09ee-4222-bb11-b3720e4a7607",
    "9dcbdfa0-2461-4599-b052-481b9a5fe5c0",
    "2ff8250e-ce49-405f-aa65-9349fbb9d8b7",
    "e18f3db9-1e32-457e-b50e-af3ecfe0a769",
    "be41de3c-6dbd-4532-aaba-20a5a485b620",
    "bfcaafc0-e907-4cde-a56c-6d932444299b",
    "ad4a24ef-2e09-45d1-9d11-0a83f797800d",
    "cc59db12-f88d-4502-9b1c-8bcc7a3b8bf1",
    "20e9f61c-8072-4f50-b257-b6b4219669d2",
    "e91a3b9c-d1f0-4c6d-8500-f37c92c16b80",
    "009de0ef-d102-4323-8dac-d78561c43210",
    "1ae572e3-0bbd-45fa-8dfc-5547c3509723",
    "a9169e52-441f-4096-9892-9da548f01cb3",
    "746fc7f6-fdea-499a-8adf-8d4b31ecc243",
    "9749d4bf-f075-4507-acb7-96272fcb70d4",
    "8be7173f-2cc9-445a-892d-c942d66fb938",
    "95a6d753-2862-461f-a18e-feafd3b054c3",
    "4818aac8-1a69-426b-8a55-a7fcb4e89126",
    "dd95f56e-bffc-44af-9fea-e181fce71122",
    "1a4bfb44-0ab1-40f3-9150-688b04cfe158",
    "9ffb20d8-d103-42f8-b31c-4537e7586fe4",
    "0c715f3d-bd25-4e2a-af9d-2477f0ec3aa4",
    "1830d4f8-a243-47d8-b8b8-943f7170b163",
    "ee80fe60-863c-4abe-9ea9-15757c6a3cd7",
    "e99558e5-1605-45e1-8810-504b01ab3322",
    "3ef50600-f90a-4bd0-8682-cb45840d2c52",
    "4613e6a8-e551-4e48-bb6c-f7d6569ce45d",
    "b728b812-9ffe-43f0-b0db-37c3b9288f1d",
    "ada0073c-3f43-42b2-915a-d30ade4bbdf9",
    "03a718be-7d09-4bc9-a842-417b16a0cba2",
    "47c0672a-92ce-4196-9d7a-68238c698b09",
    "591bb340-cb1b-4407-8e95-84e951830e64",
    "a9f83a8f-a0f9-4b6c-bcaf-8dff7aee6951",
    "79674b97-260e-46d0-8749-d9e5f57cee48",
    "f04b6c2b-725b-42f5-954e-c07d82d596f8",
    "40577cff-70b3-4cee-859e-83d1469bdf47",
    "1fb315a1-aaf0-4d31-9f24-cdd6afe6e657",
    "ecab8304-b6fd-448f-ba7b-729398bc4a94",
    "46dc5827-b175-4ae8-b803-d3a26b5f03ab",
    "39d9655f-58fb-4550-93ec-6bde8df12211",
    "d91df2de-ba34-49fe-b47a-ca8f98e39ea3",
    "db441e23-1acd-4bfc-b3b1-76ec80d9bd02",
    "f7a3d74d-849a-4c2f-a11e-a703043ace2d",
    "71ea9955-8400-4553-87a5-4c325923d21f",
    "1b21d193-72e6-4033-a392-cb26855fdb04",
    "42548ecc-d506-440b-893a-747825d3239f",
    "88389e8b-60f7-4702-a76c-e58a87fdfd8c",
    "b68b677e-562e-456d-9c27-3ebf437e7bd5",
    "f7327711-dc58-47c2-bb7a-11cfb93e70c2",
    "dcdd41e9-8c0f-4929-8030-b529f8076661",
    "ed977cb8-0020-47f7-bcad-b4025eb7a259",
    "e0d27f2a-b9ff-4b72-baf7-95c5e31e034a",
    "eac4c82a-1d28-4a4a-a9e2-a9932156c34a",
    "f629b169-d2e3-4c63-bda0-1e58cfdb27c0",
    "2beea4bf-b4cd-4531-a1f9-2f993e3161c2",
    "d1d79b98-4866-43ab-911b-00219d674c2e",
    "19bcbb45-eb5c-465b-a11b-dcbf38f7b1ef",
    "926e4821-c787-49c3-a884-631d5928c23a",
    "81b41bac-c9ae-4356-963c-f2585bceab19",
    "7c20d95e-8e76-4761-8c22-b11ec559f15b",
    "e9521b23-f3b2-4274-ac38-683787803e79",
    "99c62ac3-90f7-4fc0-b18f-9f67ce5123a5",
    "d80d6a3e-feac-4a95-8a30-f7b778ede62a",
    "b2eebb3b-868c-4e25-8759-da096407f361",
    "cd8d0f22-8dfb-4d88-a983-0721e63b93d0",
    "3c6ee8f1-a6cc-4f1c-9c35-991bbb706462",
    "b80d5294-8fb3-4299-8911-51637b1992ec",
    "1ff95f65-44c4-4cc8-bf0d-a5403ae3cf3f",
    "5e7ad61e-a055-4ca3-aaec-28a283658f5e",
    "a362c5ee-705b-4c7d-bf5f-c616e47ada19",
    "e6ffb1a4-22e1-45d5-8c26-3fe7c7e899af",
    "14a05500-1118-48d8-8e23-262068bf0062",
    "2989249b-5f81-4340-b2a1-e4db4c9aac5b",
    "95f73c68-c323-4097-939e-397cc31a86af",
    "568c9caa-a08d-4b2c-8441-c560ad0a8507",
    "bc37980e-cfa0-4402-98fd-d741b39495f0",
    "5005ea92-30b7-4d79-bbe4-713e518c47e8",
    "045f9998-20dd-419f-9d23-3af2c5bed357",
    "d7cfe3be-cb1c-4f42-9d18-029a3ad13d91",
    "7e9abbd0-0f2e-43b8-a31c-e8fd5f7e43b3",
    "0839a03f-a227-4ba0-aac4-1a30ffa05cad",
    "953b8447-a81d-41c7-aeee-d4ed59ef3f02",
    "43ab5d39-a7d4-4bcf-9a78-30497419ed85",
    "6e0dc789-2c98-428f-a538-27b359abb26c",
    "fefa7083-72e1-4541-9fb4-d0c3cc230c19",
    "eeeedb45-2214-4a75-bd5f-1c75f6c1296c",
    "f4dda4b2-6c56-45ea-8590-c617c25f93fd",
    "e1fd2835-9572-4c71-b54f-e2efe7eaf03c",
    "13dba30e-7714-433a-9665-a1eee3888f23",
    "72b79dd5-aa25-458b-9ab2-2f0e5bfee04a",
    "d4903d34-f384-437c-aa5a-2a4e1f4e7e2b",
    "09e34c6e-66b1-4254-ab5e-6f969f7de721",
    "e6891e5d-6f9d-414a-b2ec-0ce264868b1f",
    "6729a32b-be21-4ead-a949-9d39d02c0c54",
    "e9d2998f-e869-4738-a037-07b6ea4a2764",
    "6b707363-7f72-416d-8af6-27390611af1c",
    "0a3ccb1b-fd7f-43d6-985a-33b496e406bb",
    "d9733782-7624-4db5-bf1f-7a9db1002771",
    "1221ca84-475f-4f5e-a558-37ade52d1739",
    "4358edc1-a2fb-40f8-b24e-98463282d8cb",
    "c7269278-d5bc-4efe-b696-e899d07e9f1e",
    "d4ce7dc2-8f49-4e81-9d7f-9cd727ce2da0",
    "b0d89ac7-e675-4e16-8f78-660549c65e19",
    "6378d7c1-bb11-4c45-9ace-3995b0291d07",
    "dd8412f1-4693-4308-b9d6-7d658044c36f",
    "b2a89e91-a73d-45f7-816a-dda002052f7c",
    "7d229b2d-366e-499a-91df-201ca16b44cd",
    "a0e4b825-433d-4434-bd60-454b7b1fb006",
    "218e8aec-5d96-4342-9fde-4d22e3a1792e",
    "0f060cf2-31aa-430a-a928-9ed449026eb4",
    "d3c2f70e-8d2f-46c4-a8d4-185a499821d2",
    "8be134a3-c9f8-4021-bb0e-23ea1dcf19ed",
    "0e6b63f9-6411-4452-a8e0-e48e7f64d9b5",
    "e2e59dfc-3ab8-484c-b960-43a18e022d69",
    "e37989ad-e909-4536-b2ef-9646085bcac8",
    "146275cb-d1f6-40e3-b811-7aae69d7c86f",
    "524f7abd-41b7-4c97-9b24-08fcd100f031",
    "46022d53-7ac2-455b-b6b0-893b9f39a2d2",
    "a7f4c0d0-519d-4828-a54c-a94bd1324cf7",
    "3168f539-2eb9-46be-8bed-70740a221715",
    "093d9086-3581-4500-8f69-20a7839f8fe1",
    "63c462ae-57ff-4052-88c5-ce4bc2d7fafd",
    "5cb2ed8e-1aed-4c98-8f30-cc990d61f4c7",
    "38054c7f-eca6-4f9e-a212-1795994377b6",
    "f84f133b-ed03-42ea-ad8d-e68e18c66318",
    "fff07967-97c2-4db3-b96e-5c37425869c2",
    "1d9b171d-7371-4b71-8e98-f8f3ac47e140",
    "27c63052-7a3d-4677-9cf6-ba828b27f626",
    "a755bb8d-17d2-4f7a-bd41-74c4f898db9c",
    "dbc62b13-80f6-4baf-9a80-0812ebb82bc3",
    "4bd672da-bfd4-483d-a066-fb1c7edb004f"
]


/**
 * Custom hook to fetch and manage FACEIT rankings data
 */
export function useRankings(options: UseRankingsOptions = {}): UseRankingsResult {
  const { region = 'SA', limit = 100 } = options;
  
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch rankings
  const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchTopRankings(region, 0, limit);
      
      // Transform the API response to match our expected format
      // The API returns a flat array of player objects instead of the nested structure we expect
      if (Array.isArray(response.items)) {
        setRankings(response.items);
      } else if (Array.isArray(response)) {
        setRankings(response);
      } else {
        console.error('Unexpected API response format:', response);
        setError('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRankings();
  }, [region, limit]);

  return {
    rankings,
    isLoading,
    error,
    refetch: fetchRankings
  };
}