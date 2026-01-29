import { AxiosError } from "axios";
import { useState } from "react";

/** ### Utility hook for managing request state.
 * - This hook abstracts out logic and state frequently used for GET requests.
 *
 * Used for the transition to `react-query`
 *
 * #### Usage:
 * ```tsx
 * const useCtxState = () => {
 *   const realtorId = useParams().id;
 *   const apartmentId = useParams().id;
 *
 *   // Requests based on a state value
 *   const apartmentInfoReq = useReq(async () => {
 *     if (!apartmentId) return;
 *     return await apartmentService.getApartmentDetails(apartmentId);
 *   });
 *   const buildingDetailsReq = useReq(async () => {
 *     if (!apartmentInfoReq.data?.buildingId) return;
 *     return await apartmentService.getBuildingDetails(buildingId);
 *   });
 *   const realtorDetailsReq = useReq(() => apartmentService.getRealtorDetails(realtorId));
 *   // ... other states
 *
 *   // Update when browser param changes
 *   useEffect(() => {
 *     apartmentInfoReq.load();
 *     buildingDetailsReq.load();
 *     realtorDetailsReq.load();
 *     // ... other fetches
 *   }, [apartmentId]);
 *
 *   // ... other logic
 *
 *   return {
 *     apartmentInfoReq,
 *     buildingDetailsReq,
 *     realtorDetailsReq,
 *     // ... other states
 *   };
 * };
 * ```
 *
 * @todo memoize where necessary
 */
const useReq = <T, TParams extends any[] = void[], TDefault = T | null>(
  req: (...params: TParams) => Promise<T | undefined | null | void>,
  isInvalid: boolean = false,
  defaultValue?: TDefault,
  catchCallback?: (e?: AxiosError | Error) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<TDefault>((defaultValue ?? null) as TDefault);

  const load = async (...params: TParams) => {
    if (isInvalid) return;

    try {
      setIsLoading(true);
      const res = await req(...params);
      // const isUnsent = res === undefined;
      setValue((res ?? null) as TDefault);
    } catch (e) {
      catchCallback && catchCallback(e as AxiosError | Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    load,
    value,
    setValue,
  };
};

export default useReq;
