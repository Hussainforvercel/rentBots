const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const EmailTemplateDef = require('../../data/models/EmailTemplate.js');

const databaseUrl = 'mysql://root:@127.0.0.1:3306/boat';
const sequelize = new Sequelize(databaseUrl, {
  define: { freezeTableName: true },
  dialectOptions: { charset: 'utf8mb4' },
  logging: false
});

const EmailTemplate = EmailTemplateDef(sequelize, Sequelize);

const templatesDir = path.resolve(__dirname, 'template');

async function syncTemplates() {
  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const name = path.basename(file, '.js');
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const subject = name; // You can improve this to extract from file if needed

    // Upsert: update if exists, else create
    const [template, created] = await EmailTemplate.findOrCreate({
      where: { name },
      defaults: { subject, content }
    });
    if (!created) {
      template.subject = subject;
      template.content = content;
      await template.save();
      console.log(`Updated: ${name}`);
    } else {
      console.log(`Created: ${name}`);
    }
  }
  console.log('Sync complete!');
  process.exit(0);
}

// Run the sync
sequelize.sync().then(syncTemplates).catch(err => {
  console.error(err);
  process.exit(1);
}); 