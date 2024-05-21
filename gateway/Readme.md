How to run:
1. Open main microservice dir (gateway, for example) in a terminal.
2. run 'go run cmd/main.go'.
3. Open localserver in browser (see it in the terminal output) or use Altair (https://chromewebstore.google.com/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja?hl=ru&pli=1),
insomnia (https://insomnia.rest/), postman (https://www.postman.com/).

How to extend:
0. Add query or mutation into 'internal/api/graph/schema.graphqls' or 'internal/api/graph/root.graphql' or other (see gqlgen.yml in 'internal/api/').
1. Generate schema go 'code go run github.com/99designs/gqlgen generate'.
2. Add service into 'internal/services' (logic layer).
3. Add repository into 'internal/repositories' (outer connection layer).
4. Add mock answers for frontend (static correct request).
5. Write internal service in other dir (other-service/).
6. Connect repository layer in the gateway with your new service (write connection logic, update .env file).
