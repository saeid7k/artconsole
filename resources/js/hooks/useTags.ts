import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useTags(type: string | null = null, enabled: boolean = true) {

  const tagsQuery = useQuery({
    queryKey: ['all-tags', type],
    queryFn: () => {
      return axios.get(route('tags.get-all', { type }))
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
