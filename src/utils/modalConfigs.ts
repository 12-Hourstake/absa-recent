export const modalConfigs = {
  utilities: {
    title: 'Log Utility Reading',
    fields: [
      { name: 'meterType', label: 'Meter Type', type: 'select' as const, required: true, options: [
        { value: 'electricity', label: 'Electricity' },
        { value: 'water', label: 'Water' },
        { value: 'gas', label: 'Gas' }
      ]},
      { name: 'reading', label: 'Current Reading', type: 'number' as const, required: true, placeholder: '0' },
      { name: 'readingDate', label: 'Reading Date', type: 'date' as const, required: true },
      { name: 'location', label: 'Location', type: 'text' as const, required: true, placeholder: 'Building/Floor' }
    ]
  },
  
  reports: {
    title: 'Schedule Report',
    fields: [
      { name: 'reportType', label: 'Report Type', type: 'select' as const, required: true, options: [
        { value: 'maintenance', label: 'Maintenance Report' },
        { value: 'financial', label: 'Financial Report' },
        { value: 'occupancy', label: 'Occupancy Report' }
      ]},
      { name: 'frequency', label: 'Frequency', type: 'select' as const, required: true, options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' }
      ]},
      { name: 'startDate', label: 'Start Date', type: 'date' as const, required: true },
      { name: 'recipients', label: 'Email Recipients', type: 'text' as const, placeholder: 'email@absa.gh' }
    ]
  },

  documents: {
    title: 'Upload New Document',
    fields: [
      { name: 'title', label: 'Document Title', type: 'text' as const, required: true, placeholder: 'Enter document title' },
      { name: 'category', label: 'Category', type: 'select' as const, required: true, options: [
        { value: 'contract', label: 'Contract' },
        { value: 'invoice', label: 'Invoice' },
        { value: 'report', label: 'Report' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Document description' }
    ]
  },

  units: {
    title: 'Add New Unit',
    fields: [
      { name: 'unitNumber', label: 'Unit Number', type: 'text' as const, required: true, placeholder: 'A-301' },
      { name: 'type', label: 'Unit Type', type: 'select' as const, required: true, options: [
        { value: 'studio', label: 'Studio' },
        { value: '1br1ba', label: '1BR / 1BA' },
        { value: '2br1ba', label: '2BR / 1BA' },
        { value: '2br2ba', label: '2BR / 2BA' },
        { value: '3br2ba', label: '3BR / 2BA' }
      ]},
      { name: 'floor', label: 'Floor', type: 'number' as const, required: true, placeholder: '1' },
      { name: 'monthlyRent', label: 'Monthly Rent (GHS)', type: 'number' as const, required: true, placeholder: '3000' },
      { name: 'status', label: 'Status', type: 'select' as const, required: true, options: [
        { value: 'vacant', label: 'Vacant' },
        { value: 'occupied', label: 'Occupied' },
        { value: 'maintenance', label: 'Under Maintenance' }
      ]}
    ]
  },

  timesheets: {
    title: 'Log New Timesheet',
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text' as const, required: true, placeholder: 'Full name' },
      { name: 'project', label: 'Project', type: 'select' as const, required: true, options: [
        { value: 'accra-mall', label: 'Accra Mall Expansion' },
        { value: 'tema-port', label: 'Tema Port Logistics' },
        { value: 'kumasi-city', label: 'Kumasi City Centre Redevelopment' },
        { value: 'east-legon', label: 'East Legon Residential Complex' }
      ]},
      { name: 'startDate', label: 'Period Start Date', type: 'date' as const, required: true },
      { name: 'endDate', label: 'Period End Date', type: 'date' as const, required: true },
      { name: 'totalHours', label: 'Total Hours', type: 'number' as const, required: true, placeholder: '40.0' },
      { name: 'description', label: 'Work Description', type: 'textarea' as const, placeholder: 'Describe work completed' }
    ]
  },

  tankerRequests: {
    title: 'New Tanker Request',
    fields: [
      { name: 'property', label: 'Property', type: 'select' as const, required: true, options: [
        { value: 'polo-heights', label: 'Polo Heights' },
        { value: 'villagio-apartments', label: 'The Villagio Apartments' },
        { value: 'trassaco-valley', label: 'Trassaco Valley' },
        { value: 'airport-residential', label: 'Airport Residential' }
      ]},
      { name: 'volume', label: 'Volume (Liters)', type: 'number' as const, required: true, placeholder: '10000' },
      { name: 'deliveryDate', label: 'Preferred Delivery Date', type: 'date' as const, required: true },
      { name: 'urgency', label: 'Urgency Level', type: 'select' as const, required: true, options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'emergency', label: 'Emergency' }
      ]},
      { name: 'notes', label: 'Additional Notes', type: 'textarea' as const, placeholder: 'Special instructions or requirements' }
    ]
  },

  fuelAudits: {
    title: 'Schedule New Audit',
    fields: [
      { name: 'vehicle', label: 'Vehicle', type: 'select' as const, required: true, options: [
        { value: 'hilux-as1234', label: 'Toyota Hilux (AS-1234-22)' },
        { value: 'ranger-gt5678', label: 'Ford Ranger (GT-5678-21)' },
        { value: 'cruiser-aw2024', label: 'Toyota Land Cruiser (AW-2024-23)' },
        { value: 'hardbody-gn4321', label: 'Nissan Hardbody (GN-4321-20)' }
      ]},
      { name: 'driver', label: 'Driver', type: 'select' as const, required: true, options: [
        { value: 'kwame-osei', label: 'Kwame Osei' },
        { value: 'adwoa-asante', label: 'Adwoa Asante' },
        { value: 'yaw-boateng', label: 'Yaw Boateng' },
        { value: 'esi-badu', label: 'Esi Badu' }
      ]},
      { name: 'startDate', label: 'Audit Start Date', type: 'date' as const, required: true },
      { name: 'endDate', label: 'Audit End Date', type: 'date' as const, required: true },
      { name: 'auditType', label: 'Audit Type', type: 'select' as const, required: true, options: [
        { value: 'routine', label: 'Routine Audit' },
        { value: 'investigation', label: 'Investigation' },
        { value: 'compliance', label: 'Compliance Check' }
      ]},
      { name: 'notes', label: 'Audit Notes', type: 'textarea' as const, placeholder: 'Special focus areas or concerns' }
    ]
  }
};