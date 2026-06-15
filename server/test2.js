import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv(
  '_mongodb._tcp.cluster0.rex5ix8.mongodb.net',
  (err, records) => {
    if (err) {
      console.error(err);
    } else {
      console.log(records);
    }
  }
);