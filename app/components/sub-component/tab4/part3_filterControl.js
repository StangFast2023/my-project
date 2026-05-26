export const T4P3_filterControl = (data, filters) => {
    const rawObj = data?.tab4?.part2?.data || {};
    let list = Object.values(rawObj);
    const cleanRegions      = filters?.regions?.filter(id => !id.startsWith('reg-')) || [];
    const cleanPositions    = filters?.positions?.filter(id => !id.startsWith('type-')) || [];
    const showEmpty         = filters?.showEmpty ? ( filters.showEmpty === true ? true : false ) : false ;
    return { list, cleanRegions, cleanPositions, showEmpty };
};