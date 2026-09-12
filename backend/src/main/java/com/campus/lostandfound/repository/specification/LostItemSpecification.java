package com.campus.lostandfound.repository.specification;

import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.enums.LostItemStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

public class LostItemSpecification {

    public static Specification<LostItem> withQuery(String query) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(query)) return null;
            String pattern = "%" + query.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("itemName")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("brand")), pattern),
                cb.like(cb.lower(root.get("locationLost")), pattern)
            );
        };
    }

    public static Specification<LostItem> withCategory(String category) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(category)) return null;
            return cb.equal(cb.lower(root.get("category").get("name")), category.toLowerCase());
        };
    }

    public static Specification<LostItem> withColor(String color) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(color)) return null;
            return cb.like(cb.lower(root.get("color")), "%" + color.toLowerCase() + "%");
        };
    }

    public static Specification<LostItem> withBrand(String brand) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(brand)) return null;
            return cb.like(cb.lower(root.get("brand")), "%" + brand.toLowerCase() + "%");
        };
    }

    public static Specification<LostItem> withLocation(String location) {
        return (root, q, cb) -> {
            if (!StringUtils.hasText(location)) return null;
            return cb.like(cb.lower(root.get("locationLost")), "%" + location.toLowerCase() + "%");
        };
    }

    public static Specification<LostItem> withStatus(LostItemStatus status) {
        return (root, q, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<LostItem> withDateRange(LocalDate dateFrom, LocalDate dateTo) {
        return (root, q, cb) -> {
            if (dateFrom != null && dateTo != null) {
                return cb.between(root.get("dateLost"), dateFrom, dateTo);
            } else if (dateFrom != null) {
                return cb.greaterThanOrEqualTo(root.get("dateLost"), dateFrom);
            } else if (dateTo != null) {
                return cb.lessThanOrEqualTo(root.get("dateLost"), dateTo);
            }
            return null;
        };
    }
}
