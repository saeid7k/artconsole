import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  type?: string | null;
  enabled?: boolean;
}

function useTags({type = null, enabled = true}: Props) {

  const tagsQuery = useQuery({
    queryKey: ['all-tags', type],
    queryFn: () => {
      return axios.get(route('tags.get-all', { type: type ?  type : 'all' }))
        .then(res => res.data)
        .catch(err => {
          throw err;
        })
    },
    enabled: enabled,
  })

  return { tagsQuery, tags: tagsQuery.data || [] };

}

export default useTags;
