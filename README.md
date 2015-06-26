Migrations

```
db.organizations.find({'description.md' : { '$exists': true}}).forEach(function(x){
  x.description = x.description.md;
  db.organizations.save(x);
});

db.people.find({'description.md' : { '$exists': true}}).forEach(function(x){
  x.description = x.description.md;
  db.people.save(x);
});

db.projects.find({'description.md' : { '$exists': true}}).forEach(function(x){
  x.description = x.description.md;
  db.projects.save(x);
});
```

```
db.projects.update({productionStatus: 'Valid'}, {$set: {productionStatus: 'Released'}}, {multi: true});
```

```
db.projects.update({projectType: 'web series'}, {$set: {projectType: 'Series'}}, {multi: true});
```