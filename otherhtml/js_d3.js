// Load data from merged_data.csv using D3.js
d3.csv("merged_data_for_d3.csv").then(function(data) {
    // Extract unique industries and job titles
    const uniqueIndustries = [...new Set(data.map(d => d.Industry))];
    const uniqueTitles = [...new Set(data.map(d => d.title))];
    
    // Create node labels for the Sankey diagram
    const nodeLabels = uniqueIndustries.concat(uniqueTitles);

    // Create node indices for the Sankey diagram
    const industryIndices = [...Array(uniqueIndustries.length).keys()];
    const titleIndices = [...Array(uniqueTitles.length).keys()].map(i => i + uniqueIndustries.length);

    // Define colors for each industry
    const industryColors = {
        'Business': 'rgba(255, 165, 0, 0.5)',   // Orange
        'Technology': 'rgba(0, 255, 255, 0.5)', // Cyan
        'Healthcare': 'rgba(0, 100, 0, 0.7)'    // Darker Green
        // Add more colors for additional industries if needed
    };

    // Assign colors to nodes based on industries
    const nodeColors = uniqueIndustries.map(industry => industryColors[industry]);

    // Create Sankey diagram data
    const sources = data.map(d => uniqueIndustries.indexOf(d.Industry));
    const targets = data.map(d => titleIndices[uniqueTitles.indexOf(d.title)]);
    const values = new Array(data.length).fill(1);
    const linkColors = data.map(d => industryColors[d.Industry]); // Color for each link based on industry

    // Create data object for Plotly Sankey diagram
    const sankeyData = {
        type: 'sankey',
        orientation: 'h',
        node: {
            pad: 15,
            thickness: 20,
            line: {
                color: 'black',
                width: 0.5
            },
            label: nodeLabels,
            color: nodeColors, // Assign node colors based on industries
            hovertemplate: '%{label}',
            font: { // Add this property
                size: 10 // Adjust this value to shrink or enlarge the text size
            }
        },
        link: {
            source: sources,
            target: targets,
            value: values,
            color: linkColors,  // Assign link colors based on industry
            line: {
                color: linkColors,  // Set line color to match link colors
                width: 0.01       // Set line thickness
            },
            hoverinfo: 'none' // Disable hover information for links
        }
    };

    // Set layout options
    const layout = {
        title: 'Job Industries Sankey Diagram',
        font: {
            size: 40
        },
        margin: {
            l: 10, // Left margin to spread out nodes
            r: 10, // Right margin to spread out job nodes more
            t: 80,  // Top margin
            b: 10   // Bottom margin
        },
        link: {
            source: [],
            target: [],
            value: [],
            color: []
        }
    };

    // Adjust x and y properties of the right nodes to spread them out further
    const rightNodes = nodeLabels.slice(uniqueTitles.length);
    rightNodes.forEach((node, index) => {
        node.x = 1; // Push the node to the right
        node.y = index * 1000000; // Spread out the nodes vertically
    });

    // Generate the Sankey diagram using Plotly
    Plotly.newPlot('sankey-diagram', [sankeyData], layout);
}).catch(function(error) {
    console.log('Error loading data:', error);
});

