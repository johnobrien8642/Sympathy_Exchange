const buildFilters = ({OR = [], blogName_contains, tag_title_contains}) => {
    const filter = (blogName_contains || tag_title_contains) ? {} : null;
    if (blogName_contains) {
      filter.blogName = new RegExp(`${blogName_contains}`);
    }
    if (tag_title_contains) {
      filter.title = new RegExp(`${tag_title_contains}`)
    }
  
    let filters = filter ? [filter] : [];
    for (let i = 0; i < OR.length; i++) {
      filters = filters.concat(buildFilters(OR[i]));
    }
    
    return filters;
}

export default { buildFilters };

