FROM mcr.microsoft.com/dotnet/sdk:latest AS build-env
WORKDIR /app
COPY . /app/
RUN dotnet restore PokeVault.sln
RUN dotnet build -o Release PokeVault.sln

FROM mcr.microsoft.com/dotnet/aspnet:latest
COPY --from=build-env /app/Release /app
WORKDIR /app
RUN adduser api_controller
USER api_controller
RUN mkdir ~/.pokevault && chown api_controller ~/.pokevault
ENTRYPOINT [ "dotnet", "api.dll" ]