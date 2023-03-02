module.exports = {
    khanbankConfigs: {
        name: 'khanbankConfigs',
        description: 'Khanbank Configs',
        actions: [
            {
                name: 'khanbankConfigsAll',
                description: 'All',
                use: [
                    'khanbankConfigsAdd',
                    'khanbankConfigsEdit',
                    'khanbankConfigsRemove',
                    'khanbankConfigsList',
                    'khanbankConfigs'
                ]
            },
            {
                name: 'khanbankConfigsAdd',
                description: 'Add new config'   
            },
            {
                name: 'khanbankConfigsEdit',
                description: 'Edit config'
            },
            {
                name: 'khanbankConfigsRemove',
                description: 'Remove config'
            },
            {
                name: 'khanbankConfigsList',
                description: 'Show configs'
            }
        ]
    }
}