package com.campus.lostandfound.repository.specification;

import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.enums.FoundItemStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

public class FoundItemSpecification {

    public static Specification<FoundItem> withQuery(String query) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(query)) return null;
            String pattern = "%" + query.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("itemName")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("foundLocation")), pattern),
                cb.like(cb.lower(root.get("currentStorageLocation")), pattern)
            );
        };
    }

    public static Specification<FoundItem> withCategory(String category) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(category)) return null;
            return cb.equal(cb.lower(root.get("category").get("name")), category.toLowerCase());
        };
    }

    public static Specification<FoundItem> withLocation(String location) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(location)) return null;
            return cb.like(cb.lower(root.get("foundLocation")), "%" + location.toLowerCase() + "%");
        };
    }

    public static Specification<FoundItem> withStatus(FoundItemStatus status) {
        return (root, q, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<FoundItem> withDateRange(LocalDate dateFrom, LocalDate dateTo) {
        return (root, q, cb) -> {
            if (dateFrom != null && dateTo != null) {
                return cb.between(root.get("dateFound"), dateFrom, dateTo);
            } else if (dateFrom != null) {
                return cb.greaterThanOrEqualTo(root.get("dateFound"), dateFrom);
            } else if (dateTo != null) {
                return cb.lessThanOrEqualTo(root.get("dateFound"), dateTo);
            }
            return null;
        };
    }
}
