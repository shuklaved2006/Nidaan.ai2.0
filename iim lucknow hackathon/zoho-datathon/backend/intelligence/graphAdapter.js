const buildNetwork = (cases, entities) => {
    // Generate nodes and edges for Criminals, Vehicles, Phones, Cases
    const nodes = [];
    const edges = [];
    const nodeIds = new Set();

    const addNode = (id, label, type, properties = {}) => {
        if (!nodeIds.has(id)) {
            nodes.push({ id, label, type, properties });
            nodeIds.add(id);
        }
    };

    const addEdge = (source, target, relationship) => {
        edges.push({ source, target, relationship });
    };

    // Process Cases
    cases.forEach(c => {
        const caseId = `case_${c.firId}`;
        addNode(caseId, c.firNumber, 'Case', { date: c.date, type: c.crimeType });

        // Accused
        if (c.accusedIds) {
            c.accusedIds.forEach(accused => {
                const criminalId = `criminal_${accused.id}`;
                addNode(criminalId, accused.name, 'Criminal', { age: accused.age });
                addEdge(criminalId, caseId, 'ACCUSED_IN');
            });
        }

        // Vehicles
        if (c.vehicleNumbers) {
            c.vehicleNumbers.forEach(veh => {
                const vehicleId = `vehicle_${veh}`;
                addNode(vehicleId, veh, 'Vehicle');
                addEdge(caseId, vehicleId, 'INVOLVES_VEHICLE');
            });
        }

        // Phones
        if (c.phoneNumbers) {
            c.phoneNumbers.forEach(phone => {
                const phoneId = `phone_${phone}`;
                addNode(phoneId, phone, 'Phone');
                addEdge(criminalId, phoneId, 'OWNS_PHONE'); // Assuming linked to accused for simplicity in this stub
            });
        }
    });

    return { nodes, edges };
};

module.exports = {
    buildNetwork
};
