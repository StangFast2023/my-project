import React                from 'react';
import Part2_RegionRow      from './Part2_RegionRow';
export default function Part1_TableContainer({ part2, collapsedIDs, toggleRegionCollapse, toggleCollapse, roundsArray }) {
  return (
    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
        {Object.entries(part2).map(([regionKey, regionData]) => (
            <Part2_RegionRow
                key={regionKey}
                regionKey={regionKey}
                regionData={regionData}
                collapsedIDs={collapsedIDs}
                toggleRegionCollapse={toggleRegionCollapse}
                toggleCollapse={toggleCollapse}
                roundsArray={roundsArray}
            />
        ))}
    </tbody>
  );
}