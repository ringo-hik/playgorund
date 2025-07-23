// Simple test to check if commands are registered
const vscode = require('vscode');

async function testExtension() {
    try {
        console.log('Testing SWDP ChatOps Extension...');
        
        // Get all commands
        const allCommands = await vscode.commands.getCommands();
        
        // Filter for our extension commands
        const ourCommands = allCommands.filter(cmd => cmd.startsWith('swdpChatOps.'));
        
        console.log('Found commands:', ourCommands);
        
        if (ourCommands.length > 0) {
            console.log('✅ Extension commands are registered!');
            ourCommands.forEach(cmd => console.log(`  - ${cmd}`));
        } else {
            console.log('❌ No extension commands found');
        }
        
        // Try to execute refresh command
        try {
            await vscode.commands.executeCommand('swdpChatOps.refresh');
            console.log('✅ swdpChatOps.refresh command executed successfully');
        } catch (error) {
            console.log('❌ Failed to execute swdpChatOps.refresh:', error.message);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

module.exports = { testExtension };