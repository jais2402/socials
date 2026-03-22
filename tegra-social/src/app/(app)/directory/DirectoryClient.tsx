"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string | null;
  country: string | null;
  image: string | null;
  photoUrl: string | null;
  interests: string[] | null;
  bio: string | null;
  funFact: string | null;
  favouriteFood: string | null;
  favouriteSport: string | null;
}

interface DirectoryClientProps {
  employees: Employee[];
}

type CountryFilter = "All" | "India" | "Iceland";

const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳",
  Iceland: "🇮🇸",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function EmployeeCard({
  employee,
  onClick,
}: {
  employee: Employee;
  onClick: () => void;
}) {
  const displayPhoto = employee.photoUrl ?? employee.image ?? undefined;
  const initials = getInitials(employee.name);
  const shownInterests = (employee.interests ?? []).slice(0, 3);
  const remainingCount = (employee.interests ?? []).length - 3;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-zinc-300 dark:hover:border-zinc-600"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={displayPhoto} alt={employee.name} />
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {employee.name}
            </p>
            {employee.role && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                {employee.role}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {employee.country && (
          <div className="flex items-center gap-1.5">
            <span className="text-base">
              {COUNTRY_FLAGS[employee.country] ?? "🌍"}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {employee.country}
            </span>
          </div>
        )}

        {shownInterests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {shownInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingCount} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmployeeDetailDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!employee) return null;

  const displayPhoto = employee.photoUrl ?? employee.image ?? undefined;
  const initials = getInitials(employee.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={displayPhoto} alt={employee.name} />
              <AvatarFallback className="text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg">{employee.name}</DialogTitle>
              {employee.role && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {employee.role}
                </p>
              )}
              {employee.country && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {COUNTRY_FLAGS[employee.country] ?? "🌍"} {employee.country}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {employee.bio && (
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                Bio
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {employee.bio}
              </p>
            </div>
          )}

          {(employee.interests ?? []).length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {(employee.interests ?? []).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(employee.funFact ||
            employee.favouriteFood ||
            employee.favouriteSport) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 gap-3">
                {employee.funFact && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                      Fun Fact
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {employee.funFact}
                    </p>
                  </div>
                )}
                {employee.favouriteFood && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                      Favourite Food
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {employee.favouriteFood}
                    </p>
                  </div>
                )}
                {employee.favouriteSport && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                      Favourite Sport
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {employee.favouriteSport}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DirectoryClient({ employees }: DirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("All");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCountry =
        countryFilter === "All" || emp.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [employees, search, countryFilter]);

  function handleCardClick(employee: Employee) {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  }

  const countryOptions: CountryFilter[] = ["All", "India", "Iceland"];

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          {countryOptions.map((option) => (
            <Button
              key={option}
              variant={countryFilter === option ? "default" : "outline"}
              size="sm"
              onClick={() => setCountryFilter(option)}
            >
              {option === "All" ? "All" : `${COUNTRY_FLAGS[option]} ${option}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing {filtered.length} of {employees.length}{" "}
        {employees.length === 1 ? "employee" : "employees"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onClick={() => handleCardClick(emp)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No employees found matching your search.
          </p>
        </div>
      )}

      {/* Detail Dialog */}
      <EmployeeDetailDialog
        employee={selectedEmployee}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
